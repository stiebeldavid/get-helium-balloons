import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';

interface Suggestion {
  name: string;
  mapbox_id: string;
  postcode: string;
}

const SearchForm = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const navigate = useNavigate();

  const searchAddress = async (query: string) => {
    if (query.length < 2) return;

    try {
      const { data, error } = await supabase.functions.invoke('search-address', {
        body: { query }
      });

      if (error) throw error;

      // Transform Mapbox suggestions into our format
      const formattedSuggestions = data.suggestions
        .filter((suggestion: any) => suggestion.feature_type === 'postcode')
        .map((suggestion: any) => ({
          name: suggestion.name,
          mapbox_id: suggestion.mapbox_id,
          postcode: suggestion.name
        }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch address suggestions",
        variant: "destructive",
      });
    }
  };

  const handleSelect = (suggestion: Suggestion) => {
    setValue(suggestion.name);
    setOpen(false);
    if (suggestion.postcode.length === 5 && /^\d+$/.test(suggestion.postcode)) {
      navigate(`/${suggestion.postcode}`);
    } else {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 5-digit ZIP code",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-lg"
        >
          {value || "Enter ZIP Code"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search ZIP code..." 
            onValueChange={searchAddress}
            className="h-9"
          />
          <CommandEmpty>No ZIP code found.</CommandEmpty>
          <CommandGroup>
            {suggestions.map((suggestion) => (
              <CommandItem
                key={suggestion.mapbox_id}
                value={suggestion.name}
                onSelect={() => handleSelect(suggestion)}
              >
                {suggestion.name}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === suggestion.name ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchForm;