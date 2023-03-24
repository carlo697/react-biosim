import PlayPauseButton from "@/components/simulation/PlayPauseButton";
import RestartButton from "@/components/simulation/RestartButton";
import SimulationCanvas from "@/components/simulation/SimulationCanvas";

export default function Home() {
  return (
    <main className="bg-grey-dark text-white">
      <div className="min-h-screen">
        <div className="section-container py-5">
          <h1 className="mb-10 text-center text-4xl lg:text-5xl">
            Evolution Simulator
          </h1>

          <div className="grid gap-8 lg:grid-cols-2">
            <SimulationCanvas className="aspect-square w-full bg-grey-light" />
            <div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                voluptas, earum aperiam cumque ducimus repellat fuga labore
                fugit assumenda numquam placeat temporibus vitae sit nihil quis
                qui in aut eligendi?
              </p>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                voluptas, earum aperiam cumque ducimus repellat fuga labore
                fugit assumenda numquam placeat temporibus vitae sit nihil quis
                qui in aut eligendi?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-grey-mid/80 shadow-sm backdrop-blur-sm">
        <div className="section-container py-2 lg:py-5">
          <div className="flex">
            <div className="ml-auto flex gap-1">
              <RestartButton />
              <PlayPauseButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
