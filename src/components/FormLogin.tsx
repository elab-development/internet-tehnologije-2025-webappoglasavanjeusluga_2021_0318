interface PropsFormLogin {
    setIsLoginOpen: (value: boolean) => void;
}

export default function FormLogin({setIsLoginOpen}: PropsFormLogin) {
  return (
    <div className="fixed inset-0 flex items-center justify-center mb-30 ">
                <div className="relative rounded-lg p-6 w-full max-w-md  bg-white border border-gray-700">
                {/* Dugme za zatvaranje */}
                <button
                    onClick={() => setIsLoginOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                {/* Login forma */}
                <h2 className="text-2xl font-semibold mb-4">Logovanje</h2>
                <form className="flex flex-col gap-4">
                    <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                    />
                    <input
                    type="password"
                    placeholder="Lozinka"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                    />
                    <button
                    type="submit"
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
                    >
                    Prijavi se
                    </button>
                </form>
                </div>
            </div>
  )
}