import { User as UserIcon, Mail, Phone, Calendar } from "lucide-react";

interface ProfileSectionProps {
  user: any;
  profile: any;
}

const ProfileSection = ({ user, profile }: ProfileSectionProps) => {
  return (
    <div className="glass-card p-4 sm:p-8 shadow-card">
      <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4 sm:mb-6">Your Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {[
          { icon: UserIcon, label: "Name", value: profile?.name || "N/A" },
          { icon: Mail, label: "Email", value: profile?.email || user.email },
          { icon: Phone, label: "Phone", value: profile?.phone || "N/A" },
          { icon: Calendar, label: "Member Since", value: new Date(user.created_at).toLocaleDateString("en-IN") },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-secondary/50 border border-border/50 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-foreground font-medium text-sm sm:text-base truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSection;
