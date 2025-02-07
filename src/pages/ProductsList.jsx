import { useRef, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { throttle } from "lodash";
import { useCart } from "../context/CartContext";
import localProducts from "../data/products";

const ProductsList = ({ searchQuery = "", selectedCategory = "all", sort }) => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(null);
    const [fullDescriptionProductId, setFullDescriptionProductId] = useState(null); // Track the product ID for full description
    const descriptionRefs = useRef({}); // Store refs for each product description
    const [isOverflowing, setIsOverflowing] = useState({});

    useEffect(() => {
        const fetchProducts = throttle(async () => {
            try {
                const response = await axios.get("https://fakestoreapi.com/products");
                const apiProducts = response.data;

                // Merge API and local data
                const mergedProducts = [...apiProducts, ...localProducts];

                // Remove duplicates based on product ID (assuming unique IDs)
                const uniqueProducts = mergedProducts.reduce((acc, product) => {
                    if (!acc.some((p) => p.id === product.id)) {
                        acc.push(product);
                    }
                    return acc;
                }, []);

                setProducts(uniqueProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts(localProducts); // Fallback to local data if API fails
            }
        }, 500); // Throttle API request

        fetchProducts();
    }, []);


    const handleAddToCart = (product) => {
        addToCart(product);
        setAdded(product.id);
        setTimeout(() => setAdded(null), 2000); // Reset after 2 seconds
    };

    // Memoized filtering and sorting
    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
                const matchesSearch = product.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
                return matchesCategory && matchesSearch;
            })
            .sort((a, b) => {
                switch (sort) {
                    case "price-asc": return a.price - b.price;
                    case "price-desc": return b.price - a.price;
                    case "rating-asc": return (a.rating?.rate || 0) - (b.rating?.rate || 0);
                    case "rating-desc": return (b.rating?.rate || 0) - (a.rating?.rate || 0);
                    case "name-asc": return a.title.localeCompare(b.title);
                    case "name-desc": return b.title.localeCompare(a.title);
                    default: return 0;
                }
            });
    }, [products, searchQuery, selectedCategory, sort]);

    // Memoized grouping by category
    const groupedProducts = useMemo(() => {
        return filteredProducts.reduce((acc, product) => {
            if (!acc[product.category]) acc[product.category] = [];
            acc[product.category].push(product);
            return acc;
        }, {});
    }, [filteredProducts]);
    
    useEffect(() => {
        // Check if each description overflows (more than 3 lines)
        const checkOverflow = () => {
            const newOverflowing = {};
            Object.keys(descriptionRefs.current).forEach((id) => {
                const element = descriptionRefs.current[id];
                if (element) {
                    // Check if text is overflowing
                    newOverflowing[id] = element.scrollHeight > element.clientHeight;
                }
            });
            setIsOverflowing(newOverflowing);
        };

        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [products]);


    const handleDescriptionToggle = (productId) => {
        setFullDescriptionProductId((prevId) => (prevId === productId ? null : productId));
    };

    return (
        <div className="container mt-4">
            <h2>Products by Category</h2>
            {Object.keys(groupedProducts).length === 0 ? (
                searchQuery && filteredProducts.length === 0 ? (
                    <p>No products found for "{searchQuery}".</p>
                ) : (
                    <p> </p>
                )
            ) : (
                Object.entries(groupedProducts).map(([category, products]) => (
                    <div key={category} className="mt-4">
                        <h3 className="text-primary">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                        <div className="row">
                            {products.map((product) => (
                                <div key={product.id} className="col-md-4">
                                    <div className="card mb-4 shadow-sm">
                                        {/* Video Player with Thumbnail */}
                                        {product.video && (
                                            <VideoPlayer
                                                videoSrc={product.video}
                                                thumbnail={product.thumbnail}
                                            />
                                        )}
                                        {/* Conditionally render the image only if product.image exists */}
                                        {product.image && (
                                            <img
                                                src={product.image}
                                                className="card-img-top"
                                                alt={product.title}
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                        )}
                                        

                                        <div className="card-body">
                                            <h5 className="card-title">{product.title}</h5>
                                            {/* Product Description */}
                                            <p ref={(el) => (descriptionRefs.current[product.id] = el)}
                                                className="card-text"
                                                style={{
                                                    maxHeight: fullDescriptionProductId === product.id ? "none" : "4.5em",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitBoxOrient: "vertical",
                                                    WebkitLineClamp: fullDescriptionProductId === product.id ? "unset" : 3,
                                                }}
                                            >
                                                {product.description}
                                            </p>
                                            {isOverflowing[product.id] && (
                                                <button
                                                    onClick={() => handleDescriptionToggle(product.id)}
                                                    className="btn btn-link p-0 ms-2"
                                                >
                                                    {fullDescriptionProductId === product.id ? "Show Less" : "More"}
                                                </button>
                                            )}
                                            <p className="card-text">₹{product.price.toFixed(2)}</p>
                                            {/* Display category */}
                                            {product.category && (
                                                <p className="card-text">
                                                    <strong>Category:</strong> {product.category}
                                                </p>
                                            )}

                                            {/* Display rating */}
                                            {product.rating && (
                                                <p className="card-text">
                                                    <strong>Rating:</strong> {product.rating?.rate || "N/A"} (
                                                    {product.rating?.count || 0} reviews)
                                                </p>
                                            )}

                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                            {added === product.id && <div className="toast">Item added to cart!</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};


const VideoPlayer = ({ videoSrc, thumbnail }) => {
    const [isPlaying, setIsPlaying] = useState(false); // Track play state
    const [showThumbnail, setShowThumbnail] = useState(true);
    const [seekMessage, setSeekMessage] = useState(""); // Feedback for seeking
    const videoRef = useRef(null); // Reference to the video element

    // Handle play/pause functionality
    const handlePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
            setShowThumbnail(false); // Hide thumbnail when playing
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    // Full-Screen Mode Function
    const handleFullScreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.mozRequestFullScreen) {
                videoRef.current.mozRequestFullScreen(); // Firefox
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen(); // Chrome, Safari, Opera
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen(); // IE/Edge
            }
        }
    };

    const handleSeek = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
            setSeekMessage(seconds > 0 ? `+${seconds}s` : `${seconds}s`);

            setTimeout(() => setSeekMessage(""), 800); // Hide message after 0.8s
        }
    };

    // Detect when video ends and set it to paused
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            const onEnded = () => {
                setIsPlaying(false); // Video finished, set the button to "Pause"
                setShowThumbnail(true);
            };

            videoElement.addEventListener("ended", onEnded);
            // Cleanup event listener on component unmount
            return () => {
                videoElement.removeEventListener("ended", onEnded);
            };
        }
    }, []);

    return (
        <div className="video-container" style={{ position: "relative", display: "flex", flexDirection: "column" }}>
            {/* Custom Thumbnail */}
            {showThumbnail && thumbnail && (
                <img
                    src={thumbnail}
                    alt="Video Thumbnail"
                    className="video-thumbnail"
                    onClick={handlePlayPause}
                    style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        cursor: "pointer",
                        position: "absolute",
                        top: "0",
                        left: "0",
                        zIndex: 5, // Ensures it's above the video
                    }}
                />
            )}

            {/* Video Player */}
            <video
                ref={videoRef}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                controlsList="nodownload"
                onClick={handlePlayPause}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay for Double Tap Actions */}
            <div
                className="video-overlay"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 10,
                }}
            >
                {/* Left Side for Rewind */}
                <div
                    className="rewind-zone"
                    onDoubleClick={() => handleSeek(-10)}
                    style={{ width: "40%", height: "100%", cursor: "pointer" }}
                />

                {/* Right Side for Fast Forward */}
                <div
                    className="forward-zone"
                    onDoubleClick={() => handleSeek(10)}
                    style={{ width: "40%", height: "100%", cursor: "pointer" }}
                />
            </div>

            {/* Feedback for Seeking */}
            {seekMessage && (
                <div
                    className="seek-feedback"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        zIndex: 11,
                    }}
                >
                    {seekMessage}
                </div>
            )}

            {/* Custom Play/Pause Button with Icon */}
            <button
                className="btn btn-primary video-control-btn"
                onClick={handlePlayPause}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                    opacity: isPlaying ? 0 : 1, // Only show play button when paused
                    transition: "opacity 0.3s",
                }}
            >
                <i className={`fa ${isPlaying ? "fa-pause" : "fa-play"}`} />
            </button>

            {/* Pause button visibility on hover */}
            <div className="video-overlay">
                <button
                    className="btn btn-primary pause-btn"
                    onClick={handlePlayPause}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                    }}
                >
                    <i className={`fa ${isPlaying ? "fa-pause" : "fa-play"}`} />
                </button>

                {/* Full-Screen Button */}
                <button
                    className="btn btn-secondary fullscreen-btn"
                    onClick={handleFullScreen}
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        zIndex: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                    }}
                >
                    <i className="fa fa-expand"></i>
                </button>
            </div>
        </div>
    );
};

export default ProductsList;
