interface PropsFormLogin {
    setIsLoginOpen: (value: boolean) => void;
}

export default function FormLogin({setIsLoginOpen}: PropsFormLogin) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
                <div className="relative rounded-lg p-6 w-full max-w-md border  border-gray-600  bg-white">
                {/* Dugme za zatvaranje */}
                <button
                    onClick={() => setIsLoginOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                {/* Login forma */}
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                <form className="flex flex-col gap-4">
                    <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                    />
                    <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                    />
                    <button
                    type="submit"
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
                    >
                    Login
                    </button>
                </form>
                </div>
            </div>
  )
}
