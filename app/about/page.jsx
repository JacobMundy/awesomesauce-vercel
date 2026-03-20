import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ImageCarousel from "@/components/ImageCarousel";

export default async function About() {
	return (
		<main className="body w-full py-20 flex flex-col items-center">
			<section className="max-w-3xl text-center">
				<h2>This is my website have fun looking around!</h2>
			</section>
		</main>
	);
}
