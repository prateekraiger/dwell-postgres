import { HeroSection } from "@/components/ui/dynamic-hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        heading="Experience Luxury Like Never Before"
        tagline="Discover a sanctuary of peace and elegance in the heart of the city. Your perfect getaway awaits at Dwell."
        buttonText="View Rooms"
        buttonLink="/rooms"
        imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        videoUrl="https://ik.imagekit.io/mtk2a0sx6/hotel.mp4"
      />

      {/* Featured Section */}
      <section className="py-20 px-4 md:px-8 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Dwell?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Comfort",
                description:
                  "Designed for your ultimate relaxation with top-tier amenities.",
              },
              {
                title: "Exquisite Dining",
                description:
                  "Savor culinary masterpieces crafted by world-class chefs.",
              },
              {
                title: "Prime Location",
                description:
                  "Located in the center of it all, yet a world away from the noise.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
