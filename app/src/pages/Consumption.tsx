import LocalConsumption from "../components/features/consumption/LocalConsumption";

function Consumption() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Solar Generation Tracking
      </h2>
      <LocalConsumption />
    </div>
  );
}

export default Consumption;
