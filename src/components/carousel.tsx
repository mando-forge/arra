import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function Carousel({ slides }: { slides: React.ReactNode[] }) {
  return (
    <ShadcnCarousel className="w-full max-w-2xl sm:max-w-4xl">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="p-1 h-[300px] md:h-[500px]">
              {slide}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </ShadcnCarousel>
  )
}
