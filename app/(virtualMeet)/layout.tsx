import { ReactNode } from "react";
const VirtualMeetLayout = ({children}:{children:ReactNode}) => {
    return (
        <main className="bg-dark-2">
            {children}
        </main>
    );
}

export default VirtualMeetLayout;