import AdminNavBar from "@/app/[locale]/admin/components/AdminNavBar";
import OurSideBar from "@/app/[locale]/admin/components/ourSideBar";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";



export default function AdminLayout(
    {children}: {
        children: React.ReactNode
    }) {
    return (
        <section>
                <AdminNavBar />
                <aside className={"fixed left-0 h-full"}>
                    <OurSideBar />
                </aside>
            {children}
        </section>
    )
}