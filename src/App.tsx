import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Ledger from "@/pages/Ledger";
import Seedling from "@/pages/Seedling";
import Grafting from "@/pages/Grafting";
import PestControl from "@/pages/PestControl";
import Sales from "@/pages/Sales";
import Customer from "@/pages/Customer";
import Trace from "@/pages/Trace";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/ledger" replace />} />
        <Route element={<Layout />}>
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/seedling" element={<Seedling />} />
          <Route path="/grafting" element={<Grafting />} />
          <Route path="/pest" element={<PestControl />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/trace" element={<Trace />} />
        </Route>
        <Route path="*" element={<Navigate to="/ledger" replace />} />
      </Routes>
    </Router>
  );
}
