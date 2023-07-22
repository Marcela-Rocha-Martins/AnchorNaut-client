import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "alpinejs";

const images = [
  "https://res.cloudinary.com/ifeomaimoh/image/upload/v1652345767/demo_image2.jpg",
  "https://res.cloudinary.com/ifeomaimoh/image/upload/v1652366604/demo_image5.jpg",
  "https://res.cloudinary.com/ifeomaimoh/image/upload/v1652345874/demo_image1.jpg",
];

function Gallery() {
  const rotateAnimationHandler = (props, state) => {
    const transitionTime = props.transitionTime + "ms";
    const transitionTimingFunction = "ease-in-out";
    let slideStyle = {
      display: "block",
      minHeight: "100%",
      transitionTimingFunction: transitionTimingFunction,
      msTransitionTimingFunction: transitionTimingFunction,
      MozTransitionTimingFunction: transitionTimingFunction,
      WebkitTransitionTimingFunction: transitionTimingFunction,
      OTransitionTimingFunction: transitionTimingFunction,
      transform: `rotate(0)`,
      position:
        state.previousItem === state.selectedItem ? "relative" : "absolute",
      inset: "0 0 0 0",
      zIndex: state.previousItem === state.selectedItem ? "1" : "-2",
      opacity: state.previousItem === state.selectedItem ? "1" : "0",
      WebkitTransitionDuration: transitionTime,
      MozTransitionDuration: transitionTime,
      OTransitionDuration: transitionTime,
      transitionDuration: transitionTime,
      msTransitionDuration: transitionTime,
    };
    return {
      slideStyle,
      selectedStyle: {
        ...slideStyle,
        opacity: 1,
        position: "relative",
        zIndex: 2,
        filter: `blur(0)`,
      },
      prevStyle: {
        ...slideStyle,
        transformOrigin: " 0 100%",
        transform: `rotate(${
          state.previousItem > state.selectedItem ? "-45deg" : "45deg"
        })`,
        opacity: "0",
        filter: `blur( ${
          state.previousItem === state.selectedItem ? "0px" : "5px"
        })`,
      },
    };
  };

  return (
    <div
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Carousel
          showThumbs={false}
          showStatus={false}
          renderArrowNext={(clickHandler, hasNext) => {
            return (
              hasNext && (
                <button
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "-30px", // Ajuste essa posição para posicionar corretamente
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  onClick={clickHandler}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              )
            );
          }}
          renderArrowPrev={(clickHandler, hasNext) => {
            return (
              hasNext && (
                <button
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "-30px", // Ajuste essa posição para posicionar corretamente
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  onClick={clickHandler}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              )
            );
          }}
          // ... outras props do Carousel ...
        >
          {images.map((URL, index) => (
            <div className="slide" key={index}>
              <img alt="sample_file" src={URL} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Gallery;
