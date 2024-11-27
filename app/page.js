import LandingPageWrapper from "./LandingPageWrapper";

export default async function HomePage() {
  const { NEXT_PUBLIC_BASE_URL } = process.env;

  const fetchWithErrorHandling = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Error fetching ${url}:`,
        response.status,
        response.statusText
      );
      return null; // Or handle the error gracefully
    }
    return response.json();
  };

  const [blogsResponse, categoriesResponse, blogGameCategoryResponse] =
    await Promise.all([
      fetchWithErrorHandling(`${NEXT_PUBLIC_BASE_URL}/api/allblogs`),
      fetchWithErrorHandling(`${NEXT_PUBLIC_BASE_URL}/api/categories`),
      fetchWithErrorHandling(
        `${NEXT_PUBLIC_BASE_URL}/api/categoryblogs/pc-games`
      ),
    ]);

  // Ensure fallback values if the responses are null
  const blogs = blogsResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  const blogGameCategory = blogGameCategoryResponse || {};

  return (
    <div className="homepage-container">
      {/* Left Section: Windows & Mac */}
      <div className="left-section">
        <h2>Windows & Mac</h2>
        <ul>
          {categories
            .filter((category) => category.name === "Windows" || category.name === "Mac")
            .map((category) => (
              <li key={category._id}>{category.name}</li>
            ))}
        </ul>
      </div>

      {/* Right Section: Fixed PC Games */}
      <div className="right-section">
        <h2>PC Games</h2>
        <ul>
          {blogGameCategory.data &&
            blogGameCategory.data.map((game) => (
              <li key={game._id}>{game.name}</li>
            ))}
        </ul>
      </div>

      <LandingPageWrapper
        blogs={blogs}
        categories={categories}
        blogGameCategory={blogGameCategory}
      />
    </div>
  );
}
