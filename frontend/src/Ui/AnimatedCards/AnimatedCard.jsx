import { Animated } from "./Animated";

export function AnimatedCard() {
  const testimonials = [
    {
      quote:
        "The printing quality exceeded my expectations. Vibrant colors and smooth textures made my design come to life.",
      name: "T-Shirts Printing",
      designation: "Expert in vibrant designs.",
      src: "/h4.jpg"    },
    {
      quote:
        "Every stitch tells a story! The embroidery is precise and adds a premium feel to our apparel.",
      name: "T-Shirts Embroidery",
      designation: "Craftsmanship in every stitch.",
      src: "/h5.jpg"    },
    {
      quote:
        "The sublimation prints are flawless. The designs blend seamlessly into the fabric without fading over time.",
      name: "Sublimation Printing",
      designation: "Seamless all-over designs.",
      src: "/h6.jpg"    },
    {
      quote:
        "Collaborating on the designs was a breeze. The team captured my vision perfectly and delivered stunning results.",
      name: "Design Creations",
      designation: "Innovative custom artwork.",
      src: "/h7.jpg"    },
    {
      quote:
        "Customization options were incredible! They tailored every detail to fit our brand identity perfectly.",
      name: "Order Customization",
      designation: "Tailored to your needs.",
      src: "/h8.jpg"    },
    {
      quote:
        "Our team loved the timely packaging and the professional presentation. The shirts were ready to impress!",
      name: "Packaging & Delivery",
      designation: "Efficient and reliable service.",
      src: "/h1.jpg"    },
    {
      quote:
        "Screen printing gave us bold, sharp designs that stood out in every event. Perfect for large orders.",
      name: "Screen Printing",
      designation: "Ideal for bulk production.",
      src: "/h2.jpg"    },
    {
      quote:
        "The Direct-to-Garment prints were incredibly detailed. It’s perfect for creating custom art pieces on apparel.",
      name: "Direct-to-Garment",
      designation: "High-quality detailed prints.",
      src: "/h3.jpg"    },
  ];
  return <Animated testimonials={testimonials} />;
}
