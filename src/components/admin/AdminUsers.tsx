
import { useState, useEffect } from "react";
import { ref, onValue, update, set } from "firebase/database";
import { db } from "@/config/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, X, Calendar } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    daysToAdd: 0
  });

  useEffect(() => {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.keys(usersData).map(key => ({
          id: key,
          ...usersData[key]
        }));
        setUsers(usersArray);
      }
    });
  }, []);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      daysToAdd: 0
    });
  };

  const handleSaveUser = async () => {
    try {
      if (!editingUser) return;
      
      // Update basic user info
      await update(ref(db, `users/${editingUser.id}`), {
        name: editFormData.name,
        email: editFormData.email
      });
      
      // If days are being added to subscription
      if (editFormData.daysToAdd > 0 && editingUser.subscription) {
        let endDate = new Date(editingUser.subscription.endDate);
        endDate.setDate(endDate.getDate() + Number(editFormData.daysToAdd));
        
        await update(ref(db, `users/${editingUser.id}/subscription`), {
          endDate: endDate.toISOString(),
          active: true
        });
      }
      
      toast.success("User updated successfully");
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRemainingDays = (subscription: any) => {
    if (!subscription) return "No subscription";
    if (!subscription.active) return "Inactive";
    
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays} days` : "Expired";
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Manage Users</h2>
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subscription Type</TableHead>
                <TableHead>Days Remaining</TableHead>
                <TableHead>Referrals</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.subscription?.type || "None"}</TableCell>
                  <TableCell>{getRemainingDays(user.subscription)}</TableCell>
                  <TableCell>{user.referrals || 0}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input 
                              value={editFormData.name} 
                              onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input 
                              value={editFormData.email} 
                              onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Add Days to Subscription</label>
                            <div className="flex items-center space-x-2">
                              <Input 
                                type="number" 
                                value={editFormData.daysToAdd} 
                                onChange={(e) => setEditFormData({...editFormData, daysToAdd: parseInt(e.target.value) || 0})}
                              />
                              <Calendar className="h-5 w-5 text-gray-500" />
                            </div>
                            <p className="text-xs text-gray-500">
                              Current expiry: {user.subscription ? new Date(user.subscription.endDate).toLocaleDateString() : "No subscription"}
                            </p>
                          </div>
                          <Button 
                            onClick={handleSaveUser}
                            className="w-full"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
