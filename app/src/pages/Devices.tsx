import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import DeviceList from "../components/features/devices/DeviceList";
import { Smartphone } from "lucide-react";

function Devices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Registered Devices
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-500" />
            Solar Devices on-chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DeviceList />
        </CardContent>
      </Card>
    </div>
  );
}

export default Devices;
