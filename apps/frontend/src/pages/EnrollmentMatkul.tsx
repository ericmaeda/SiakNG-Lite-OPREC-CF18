import { useEffect } from "react";
import { useNavigate } from "react-router";

// Legacy component - redirects to new IRS enrollment page
export function EnrollMatkul() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/irs/enroll');
    }, [navigate]);

    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: '#1A1A1A' }}>
            <div className="text-center text-white">Redirecting...</div>
        </div>
    );
}