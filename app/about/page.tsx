export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Dwell</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          At Dwell, we believe that a hotel stay should be more than just a place to sleep. It should be an experience that rejuvenates your soul and inspires your mind. Founded in 2024, we have set a new standard for luxury hospitality, blending modern elegance with timeless comfort.
        </p>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
             <img
               src="https://i.pinimg.com/1200x/eb/79/20/eb7920103e314eedd2f7874984722b6a.jpg"
               alt="Dwell Hotel - Our Story"
               className="w-full h-full object-cover"
             />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Our mission is to provide an oasis of calm in the bustling city. We are dedicated to personalized service, sustainable practices, and creating a welcoming atmosphere where every guest feels at home.
          </p>
          <ul className="space-y-4">
            {[
              "Unmatched Hospitality",
              "Sustainable Luxury",
              "Curated Experiences",
              "Architectural Excellence"
            ].map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
                { name: "Sarah Jenkins", role: "General Manager" },
                { name: "David Chen", role: "Head Chef" },
                { name: "Elena Rodriguez", role: "Guest Experience Manager" }
            ].map((member, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg bg-muted p-6 transition-all hover:bg-accent">
                    <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-background flex items-center justify-center text-2xl font-bold text-primary">
                        {member.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
