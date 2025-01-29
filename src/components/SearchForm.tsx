import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SearchForm = () => {
  const [zipCode, setZipCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.length === 5 && /^\d+$/.test(zipCode)) {
      navigate(`/${zipCode}`);
    } else {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 5-digit ZIP code",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Enter ZIP Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        className="text-lg"
        maxLength={5}
      />
      <Button type="submit" className="bg-balloon-red hover:bg-balloon-red/90">
        Find Balloons
      </Button>
    </form>
  );
};

export default SearchForm;