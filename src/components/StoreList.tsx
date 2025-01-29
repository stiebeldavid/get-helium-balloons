import { Store } from '@/types';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StoreListProps {
  stores: Store[];
  searchRadius: number;
  onRadiusChange: (radius: number) => void;
}

const StoreList = ({ stores, searchRadius, onRadiusChange }: StoreListProps) => {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <Select
          value={searchRadius.toString()}
          onValueChange={(value) => onRadiusChange(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search radius" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20">20 miles</SelectItem>
            <SelectItem value="40">40 miles</SelectItem>
            <SelectItem value="60">60 miles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {stores.length === 0 ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No stores found within {searchRadius} miles. Try increasing the search radius to find more stores.
          </AlertDescription>
        </Alert>
      ) : (
        stores.map((store) => (
          <Card key={store.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{store.name}</h3>
                <p className="text-gray-600">{store.address}</p>
                <p className="text-gray-600">{store.phone}</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${store.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-balloon-blue hover:text-balloon-blue/80"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default StoreList;