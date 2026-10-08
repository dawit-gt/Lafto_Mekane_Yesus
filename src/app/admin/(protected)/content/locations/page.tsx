import type { Metadata } from "next";
import Link from "next/link";
import { getAdminLocations } from "@/lib/data/admin-content";
import { deleteLocation } from "@/lib/actions/admin-locations";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = {
  title: "Locations",
  robots: { index: false, follow: false },
};

export default async function AdminLocationsPage() {
  const locations = await getAdminLocations();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">Locations</h1>
        <Link
          href="/admin/content/locations/new"
          className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep"
        >
          + Add Location
        </Link>
      </div>

      <p className="mt-2 text-sm text-ink/60">
        The first location you add is the one shown on the Visit and Contact pages.
      </p>

      {locations.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {locations.map((location) => (
                <tr key={location.id}>
                  <td className="px-4 py-3 font-medium text-ink">{location.name}</td>
                  <td className="px-4 py-3 text-ink/70">{location.address_line1}</td>
                  <td className="px-4 py-3 text-ink/70">{location.city}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/content/locations/${location.id}`}
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteLocation.bind(null, location.id)}
                        confirmMessage={`Delete "${location.name}"? Events using it will show no location. This can't be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No locations yet. Add the first one above.</p>
      )}
    </div>
  );
}