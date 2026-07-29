import Link from "next/link";

export default function InstallationWizardPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">PromptProfit Installation Wizard</h1>

      <p className="mt-4 text-gray-600">
        Choose how you would like to install PromptProfit on your website.
      </p>

      <div className="mt-10 space-y-4">
        <Link
          href="../self"
          className="block rounded-lg border p-6 hover:bg-gray-50"
        >
          <h2 className="font-semibold">I have access to my website</h2>

          <p className="mt-2 text-sm text-gray-500">
            Install PromptProfit yourself.
          </p>
        </Link>

        <Link
          href="../developer"
          className="block rounded-lg border p-6 hover:bg-gray-50"
        >
          <h2 className="font-semibold">My developer manages my website</h2>

          <p className="mt-2 text-sm text-gray-500">
            Generate installation instructions.
          </p>
        </Link>

        <Link
          href="../managed"
          className="block rounded-lg border p-6 hover:bg-gray-50"
        >
          <h2 className="font-semibold">PromptProfit installs it for me</h2>

          <p className="mt-2 text-sm text-gray-500">
            Request white-glove installation.
          </p>
        </Link>
      </div>
    </main>
  );
}
