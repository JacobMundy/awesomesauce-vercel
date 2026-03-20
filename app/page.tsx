import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ImageCarousel from "@/components/ImageCarousel";

export default async function Home() {
  {
    /* fetch all the images from the "Images" bucket in supabase storage and get their public urls */
  }
  const { data } = await supabase.storage.from("Images").list();
  const imageUrls =
    data?.map((file) => {
      return supabase.storage.from("Images").getPublicUrl(file.name).data
        .publicUrl;
    }) || [];

  return (
    <main className="body w-full py-20 flex flex-col items-center">

      <section className="text-center">
        <div>
          <p className="text-4xl font-bold mb-4">hello!</p>
        </div>
      </section>

      {/* One half width horizontal line */}
      <hr className="w-1/2 border-gray-700" />

      <section className="images flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-4">here are some of my cats :)</h3>
        <ImageCarousel images={imageUrls} />
      </section>

      <hr className="w-1/2 border-gray-700" />

    </main>
  );
}