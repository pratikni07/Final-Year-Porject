import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { supabase } from '../lib/supabaseClient';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
    // const { data: authListener } = supabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     setUser(session?.user ?? null);
    //     setLoading(false);
    //   }
    // );

    // return () => {
    //   authListener?.subscription?.unsubscribe();
    // };
  }, []);

  async function checkUser() {
    // try {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   setUser(user);
    // } catch (error) {
    //   console.error('Error checking user:', error);
    // } finally {
    //   setLoading(false);
    // }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
