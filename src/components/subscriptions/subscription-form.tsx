import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Subscription, FuneralType } from "@/types";
import { useSubscription } from "@/context/subscription-context";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";
import { searchServices } from "@/data/subscription-database";

interface SubscriptionFormProps {
  subscriptionId?: string;
  onSuccess?: () => void;
}

const subscriptionFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  cost: z.coerce.number().positive("Cost must be positive."),
  frequency: z.enum(["monthly", "yearly", "quarterly", "weekly"]),
  startDate: z.date(),
  endDate: z.date(),
  autoRenew: z.boolean().default(false),
  notes: z.string().optional(),
  funeralType: z.enum(["viking", "pixelated", "standard", "space"]),
  category: z.string().optional()
}).refine((data) => {
  // Ensure end date is at least 1 day after start date
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  
  // Set both dates to start of day to compare full days only
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  return diffDays >= 1;
}, {
  message: "End date must be at least 1 day after start date",
  path: ["endDate"]
});

type FormData = z.infer<typeof subscriptionFormSchema>;

// Static mapping of popular services
const SERVICE_LINKS: Record<string, string> = {
  Netflix: "https://www.netflix.com/YourAccount",
  Discord: "https://discord.com/billing",
  Spotify: "https://www.spotify.com/account/subscription/",
  Hulu: "https://secure.hulu.com/account",
  Amazon: "https://www.amazon.com/gp/your-account/order-history",
  YouTube: "https://www.youtube.com/purchases",
  Apple: "https://appleid.apple.com/account/manage",
  HBO: "https://www.hbomax.com/account",
  Disney: "https://www.disneyplus.com/account",
  Adobe: "https://account.adobe.com/plans",
  Github: "https://github.com/settings/billing",
  Notion: "https://www.notion.so/my-account",
  // Add more as needed
};

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ subscriptionId, onSuccess }) => {
  const { addSubscription, updateSubscription, getSubscription } = useSubscription();
  
  const existingSubscription = subscriptionId ? getSubscription(subscriptionId) : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: existingSubscription
      ? {
          ...existingSubscription,
          startDate: new Date(existingSubscription.startDate),
          endDate: new Date(existingSubscription.endDate),
        }
      : {
          name: "",
          website: "",
          cost: 0,
          frequency: "monthly",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          autoRenew: false,
          notes: "",
          funeralType: "standard",
          category: "Software",
        },
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);

  const onSubmit = (data: FormData) => {
    if (existingSubscription) {
      updateSubscription(subscriptionId!, {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      });
    } else {
      // Ensure all required fields are present
      const newSubscription: Omit<Subscription, "id" | "status"> = {
        name: data.name,
        website: data.website || "",
        cost: data.cost,
        frequency: data.frequency,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        autoRenew: data.autoRenew,
        notes: data.notes || "",
        funeralType: data.funeralType,
        category: data.category || "Other"
      };
      
      addSubscription(newSubscription);
    }
    if (onSuccess) onSuccess();
  };

  // Handle input change for subscription name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    form.setValue('name', query);
    
    // Get suggestions from database
    if (query.length > 1) {
      const matches = searchServices(query);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (service: any) => {
    form.setValue('name', service.name);
    form.setValue('website', service.managementUrl);
    setSuggestions([]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Netflix, Spotify, etc." 
                      {...field} 
                      onChange={handleNameChange}
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute z-10 w-full bg-black border border-gray-700 rounded-md mt-1 max-h-48 overflow-y-auto">
                        {suggestions.map((service) => (
                          <div
                            key={service.name}
                            className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center gap-2"
                            onClick={() => handleSuggestionClick(service)}
                          >
                            <span>{service.icon}</span>
                            <span>{service.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://netflix.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input type="number" step="0.01" className="pl-7" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="autoRenew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Auto-Renewal</FormLabel>
                  <FormDescription>
                    Will this subscription renew automatically?
                  </FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="funeralType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Funeral Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                >
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-vaporwave-neonPink">
                      <FormControl>
                        <RadioGroupItem value="viking" className="sr-only" />
                      </FormControl>
                      <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-vaporwave-neonPink">
                        <span className="text-2xl">🛥️</span>
                        <span className="font-medium">Viking</span>
                      </div>
                    </FormLabel>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-vaporwave-neonPink">
                      <FormControl>
                        <RadioGroupItem value="pixelated" className="sr-only" />
                      </FormControl>
                      <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-vaporwave-neonPink">
                        <span className="text-2xl">👾</span>
                        <span className="font-medium">Pixelated</span>
                      </div>
                    </FormLabel>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-vaporwave-neonPink">
                      <FormControl>
                        <RadioGroupItem value="standard" className="sr-only" />
                      </FormControl>
                      <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-vaporwave-neonPink">
                        <span className="text-2xl">⚰️</span>
                        <span className="font-medium">Standard</span>
                      </div>
                    </FormLabel>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-vaporwave-neonPink">
                      <FormControl>
                        <RadioGroupItem value="space" className="sr-only" />
                      </FormControl>
                      <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-vaporwave-neonPink">
                        <span className="text-2xl">🚀</span>
                        <span className="font-medium">Space</span>
                      </div>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes about this subscription..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" className="bg-vaporwave-neonPink hover:bg-vaporwave-neonPink/80">
            {existingSubscription ? "Update" : "Add"} Subscription
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubscriptionForm;
