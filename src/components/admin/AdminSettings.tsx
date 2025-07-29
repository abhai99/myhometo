
import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "@/config/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    weeklyPrice: 299,
    monthlyPrice: 999,
  });

  useEffect(() => {
    const settingsRef = ref(db, 'settings');
    onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.val());
      } else {
        // If settings doesn't exist, create it
        update(ref(db, 'settings'), settings);
      }
    });
  }, []);

  const handleSaveSettings = async () => {
    try {
      await update(ref(db, 'settings'), settings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to update settings");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="weeklyPrice">Weekly Subscription Price (₹)</Label>
            <Input
              id="weeklyPrice"
              type="number"
              value={settings.weeklyPrice}
              onChange={(e) => setSettings({...settings, weeklyPrice: Number(e.target.value)})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyPrice">Monthly Subscription Price (₹)</Label>
            <Input
              id="monthlyPrice"
              type="number"
              value={settings.monthlyPrice}
              onChange={(e) => setSettings({...settings, monthlyPrice: Number(e.target.value)})}
            />
          </div>
          
          <Button className="w-full" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
