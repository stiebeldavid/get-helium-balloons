import { Store } from '@/types';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface StoreListProps {
  stores: Store[];
}

const StoreList = ({ stores }: StoreListProps) => {
  return (
    <div className="space-y-4">
      {stores.map((store) => (
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
      ))}
    </div>
  );
};

export default StoreList;