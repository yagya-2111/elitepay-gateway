import { User as UserIcon, Mail, Phone, Calendar } from "lucide-react";

interface ProfileSectionProps {
  user: any;
  profile: any;
}

const ProfileSection = ({ user, profile }: ProfileSectionProps) => {
  return (
    <div className="glass-card p-8 shadow-card">
      <h2 className="text-2xl font-display font-bold text-foreground mb-6">Your Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: UserIcon, label: "Name", value: profile?.name || "N/A" },
          { icon: Mail, label: "Email", value: profile?.email || user.email },
          { icon: Phone, label: "Phone", value: profile?.phone || "N/A" },
          { icon: Calendar, label: "Member Since", value: new Date(user.created_at).toLocaleDateString("en-IN") },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-foreground font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSection;
