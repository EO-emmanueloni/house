const ProfileAvatar = ({ name, username, photoURL, size = "50px", bgColor = "bg-blue-500", textColor = "text-white" }) => {
    const getUserInitials = (name) => {
        const displayName = name || username;  // ✅ Use username if name is missing
        if (!name) return "U";
        const nameParts = displayName.split(" ");
        return nameParts.length > 1 ? nameParts[0][0] + nameParts[1][0] : nameParts[0][0];
    };

    return (
        <div 
            style={{ width: size, height: size }} 
            className={`flex items-center justify-center rounded-full ${bgColor} ${textColor} font-semibold text-lg`}
        >
            {photoURL ? (
                <img 
                    src={photoURL} 
                    alt={name || username || "User"} 
                    className="w-full h-full rounded-full object-cover border border-gray-200" 
                />
            ) : (
                getUserInitials(name, username)
            )}
        </div>
    );
};

export default ProfileAvatar;
