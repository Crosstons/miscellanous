import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";

const Navbar = () => {
    return(
        <header className="text-[#4b5563] body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                <span className="text-3xl font-bold text-rex -ml-3 cursor-pointer">CLUSTERS</span>
            </a>
            <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link to="/browse/" className="mr-6 text-xl hover:text-gray-900 cursor-pointer mb-3 sm:mb-3">Browse</Link>
      <a href="/clustors/create/" className="mr-6 text-xl hover:text-gray-900 cursor-pointer mb-3 sm:mb-3">Create Clustor</a>
    </nav>
            <button className="inline-flex text-[#ffffff] bg-cex border-0 mb-2 py-2 px-6 focus:outline-none hover:bg-rex rounded text-lg hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                <WalletMultiButton />
            </button>
        </div>
        </header>
    );
}

export default Navbar;