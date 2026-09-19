import { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  Star,
  TrendingUp,
} from 'lucide-react';

import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../lib/firebase';

interface AffiliateClick {
  id: string;
  productId: string;
  productName: string;
  affiliateUrl: string;
  category: string;
  timestamp?: any;
  pageUrl?: string;
  referrer?: string;
}

interface ProductAnalytics {
  productId: string;
  productName: string;
  affiliateUrl: string;
  category: string;
  clicks: number;
  lastClicked?: any;
}

export default function AffiliateAnalytics() {
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const clicksCollection = collection(db, 'affiliateClicks');

      const clicksQuery = query(
        clicksCollection,
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(clicksQuery);

      const clickData = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as AffiliateClick[];

      setClicks(clickData);
    } catch (error) {
      console.error('Failed to load affiliate analytics:', error);
      alert('Unable to load analytics. Check Firebase Firestore rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const productAnalytics = useMemo(() => {
    const productsMap = new Map<string, ProductAnalytics>();

    clicks.forEach((click) => {
      const existing = productsMap.get(click.productId);

      if (existing) {
        existing.clicks += 1;

        if (
          click.timestamp &&
          (!existing.lastClicked ||
            click.timestamp.seconds > existing.lastClicked.seconds)
        ) {
          existing.lastClicked = click.timestamp;
        }
      } else {
        productsMap.set(click.productId, {
          productId: click.productId,
          productName: click.productName || 'Unknown Product',
          affiliateUrl: click.affiliateUrl || '',
          category: click.category || 'Unknown',
          clicks: 1,
          lastClicked: click.timestamp,
        });
      }
    });

    return Array.from(productsMap.values()).sort(
      (a, b) => b.clicks - a.clicks
    );
  }, [clicks]);

  const categoryAnalytics = useMemo(() => {
    const categoryMap = new Map<string, number>();

    clicks.forEach((click) => {
      const category = click.category || 'Unknown';

      categoryMap.set(
        category,
        (categoryMap.get(category) || 0) + 1
      );
    });

    return Array.from(categoryMap.entries())
      .map(([category, clicks]) => ({
        category,
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks);
  }, [clicks]);

  const totalClicks = clicks.length;

  const topProduct = productAnalytics.length > 0
    ? productAnalytics[0]
    : null;

  const totalProductsClicked = productAnalytics.length;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No data';

    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      }

      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#b8860b] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading affiliate analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-[#b8860b] mb-1">
            Affiliate Performance
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Affiliate Analytics
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Track which products and affiliate links receive the most clicks.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="px-5 py-2.5 bg-[#b8860b] text-white rounded-lg font-medium hover:bg-[#9a7009] transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        {/* Total Clicks */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Affiliate Clicks
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {totalClicks}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#b8860b]" />
            </div>
          </div>
        </div>

        {/* Products Clicked */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Products Clicked
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {totalProductsClicked}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-[#b8860b]" />
            </div>
          </div>
        </div>

        {/* Top Product */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div>
            <p className="text-sm text-gray-500">
              Most Clicked Product
            </p>

            <h2 className="text-lg font-bold text-gray-900 mt-2 truncate">
              {topProduct ? topProduct.productName : 'No clicks yet'}
            </h2>

            <p className="text-sm text-[#b8860b] font-semibold mt-1">
              {topProduct ? `${topProduct.clicks} clicks` : '0 clicks'}
            </p>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Product Analytics */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Product Click Performance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Products ranked by total affiliate clicks.
            </p>
          </div>

          {productAnalytics.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No affiliate clicks recorded yet.
              <br />
              Click one of your affiliate links to test the tracking.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Rank
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Product
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Category
                    </th>

                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Clicks
                    </th>

                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Link
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {productAnalytics.map((product, index) => (
                    <tr
                      key={product.productId}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <span className="font-bold text-[#b8860b]">
                          #{index + 1}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {product.productName}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Last clicked: {formatDate(product.lastClicked)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="font-bold text-lg text-gray-900">
                          {product.clicks}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        {product.affiliateUrl && (
                          <a
                            href={product.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-[#b8860b] hover:text-white transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* Category Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">

          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Category Performance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Clicks by category.
            </p>
          </div>

          {categoryAnalytics.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No category data yet.
            </div>
          ) : (
            <div className="p-5 space-y-5">

              {categoryAnalytics.map((item) => {
                const percentage =
                  totalClicks > 0
                    ? Math.round((item.clicks / totalClicks) * 100)
                    : 0;

                return (
                  <div key={item.category}>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {item.category}
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        {item.clicks}
                      </span>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#b8860b] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>

      {/* Recent Clicks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 overflow-hidden">

        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Affiliate Clicks
          </h2>
        </div>

        {clicks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No clicks recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {clicks.slice(0, 10).map((click) => (
              <div
                key={click.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {click.productName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {click.category}
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  {formatDate(click.timestamp)}
                </div>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}