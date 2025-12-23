import { CoreImage } from "@/components/atoms/CoreImage";
import CoreLoading from "@/components/molecules/CoreLoading";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";

const CorePdfViewer = dynamic(
  () => import("../CorePdfViewer").then((mod) => mod.CorePdfViewer),
  {
    ssr: false,
  }
);

const PdfWrapper = dynamic(
  () => import("../CorePdfViewer").then((mod) => mod.PdfWrapper),
  {
    ssr: false,
  }
);

const getType = (src: string) => {
  const numOfDot = src.lastIndexOf(".");
  const extension = src.slice(numOfDot + 1, src.length);
  if (["pdf"].includes(extension)) return "document";
  if (["mp4", "ogg"].includes(extension)) return "media";
  return "image";
};

export default function CoreSlider({
  contents,
  mainIndex,
  props,
  setCurName,
}: {
  contents: {
    src: string;
  }[];
  mainIndex?: number;
  props?: SwiperProps;
  setCurName?: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className=" h-[90vh] w-[100vw] ">
      <Swiper
        navigation
        {...props}
        pagination={{ type: "fraction" }}
        modules={[Navigation, Pagination]}
        onSlideChange={(swiper) => {
          if (setCurName) {
            setCurName(contents[swiper.activeIndex].src);
          }
        }}
        onSwiper={(swiper) => {
          mainIndex && swiper.slideTo(mainIndex);
        }}
        className="h-full w-full rounded-lg"
      >
        {contents.map(({ src }, index) => (
          <SwiperSlide key={"key" + index}>
            {src && (
              <PdfWrapper>
                {getType(src) === "document" && (
                  <CorePdfViewer pdfFilePath={src} />
                )}

                {getType(src) === "image" && (
                  <div className="w-full h-full flex justify-center items-center mt-6">
                    <CoreImage
                      alt="img"
                      src={src}
                      className="min-h-[90vh] min-w-[50vw]"
                      onLoad={() => <CoreLoading />}
                    />
                  </div>
                )}

                {getType(src) === "media" && (
                  <div className=" flex h-full w-full items-center justify-center">
                    <video
                      className="w-fit min-h-[90vh] min-w-[50vw] mt-4"
                      controls
                    >
                      <source src={src} type="video/ogg" />
                    </video>
                  </div>
                )}
              </PdfWrapper>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
