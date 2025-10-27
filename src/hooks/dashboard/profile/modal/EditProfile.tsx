import React from 'react'
import { UserAccount } from '@/types/Auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface EditProfileProps {
    isEditing: boolean
    setIsEditing: (value: boolean) => void
    userData: UserAccount | null
    editedData: Partial<UserAccount>
    setEditedData: React.Dispatch<React.SetStateAction<Partial<UserAccount>>>
    handleSave: () => Promise<void>
}

export default function EditProfile({
    isEditing,
    setIsEditing,
    userData,
    editedData,
    setEditedData,
    handleSave
}: EditProfileProps) {
    const handleEdit = () => {
        if (userData) {
            setEditedData({
                displayName: userData.displayName,
                phoneNumber: userData.phoneNumber,
            })
            setIsEditing(true)
        }
    }

    return (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile information here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                            id="displayName"
                            value={editedData.displayName || ''}
                            onChange={(e) => setEditedData(prev => ({ ...prev, displayName: e.target.value }))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            value={editedData.phoneNumber || ''}
                            onChange={(e) => setEditedData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
