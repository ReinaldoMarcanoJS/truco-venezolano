import Sidebar from "./Sidebar";

export default function MyHeader() {
    return (
        <div className="flex justify-between w-full h-16 bg">
            <div className="w-full">

            </div>
            <Sidebar />
            <div className="flex w-full justify-end items-center">

                <div className="text-white w-20 h-12 m-3 rounded-lg flex items-center justify-center drop-shadow-lg text-xl  font-extrabold op-4 left-4 p-2  bg-text-white shadow-lg bg-black/50 ">
                    30💸
                </div>

            </div>
        </div>
    )
}