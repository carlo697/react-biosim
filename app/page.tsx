import SimulationCanvas from "@/components/SimulationCanvas";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-grey-dark text-white">
      <div className="section-container py-5">
        <h1 className="mb-10 text-center text-4xl lg:text-5xl">
          Evolution Simulator
        </h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <SimulationCanvas className="aspect-square w-full bg-grey-light" />
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
            voluptas, earum aperiam cumque ducimus repellat fuga labore fugit
            assumenda numquam placeat temporibus vitae sit nihil quis qui in aut
            eligendi?
          </div>
        </div>
      </div>
    </main>
  );
}
