"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import NewsWidget from "@/components/widgets/NewsWidget";
import WeatherWidget from "@/components/widgets/WeatherWidget";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* News Section */}
        <section id="news">
          <NewsWidget />
        </section>

        {/* Weather Section */}
        <section id="weather">
          <WeatherWidget cityId={1259229} />
        </section>

      </div>
    </DashboardLayout>
  );
}
