## Get Started

### The Problem

Zcash is a privacy-focused cryptocurrency. By its nature, the community is decentralized and often anonymous. This creates a visibility gap where users, merchants, and enthusiasts feel isolated, unaware of the density of the Zcash community in their local regions or globally. New users often ask, "Is there anyone else near me using Zcash?" without a safe way to find out.

### The Solution

The **Zcash.me Map** is a privacy-first interactive web application. It visualizes aggregated public data to show user clusters and communities worldwide without exposing precise individual locations or tracking personal data. It bridges the gap between privacy and community visibility, allowing users to see the global adoption of Zcash via a performant, responsive map interface.

## User Guide

The Zcash.me Map is an interactive tool designed to visualize the global presence of Zcash users and communities. It allows you to explore user clusters, filter by location, and view detailed profiles of community members.

### 1. Navigating the Interface

#### The Interactive Map

The central view is a dynamic world map powered by Leaflet.

- **Pan & Zoom:** You can drag to move around the globe and scroll (or pinch) to zoom in and out.
- **Clusters:** To keep the map clean, users in the same region are grouped into colored circles (Clusters). The number inside indicates how many users are in that area.
  - **Click a Cluster:** Zoom in to see individual cities or users breakdown.
- **City Markers:** Individual pins represent specific cities. Clicking a marker opens the **Community Panel** for that location.

#### The "In View" Feature

The map is smart. If you are not filtering by a specific city, simply panning the map will automatically update the side panel to show a list of **"Users in View"**—all users currently visible within the map frame.

### 2. Searching and Filtering

Located just below the header, the **Filter Bar** allows for precise navigation.

#### Filter by Country

- Click the **"All Countries"** dropdown to search for or select a specific nation.
- The list is sorted alphabetically and displays the user count for each country.
- Selecting a country zooms the map to its borders and lists all users in that country in the side panel.

#### Filter by City

- Once a country is selected (or globally), use the **"All Cities"** dropdown to find specific cities.
- Selecting a city will "fly" the map directly to that location and open the city's user list.

### 3. The Community Panel (Right Sidebar)

The panel on the right side of the screen is your information hub. It displays lists of users based on your current selection (a specific City, a whole Country, or just "Users in View").

#### Managing the List

Inside the panel, you can organize the view:

- **Categories:** Filter the list by clicking buttons such as **Business**, **Personal**, or **Organization**.
- **Sorting:** Use the dropdown to sort users by:
  - **Name:** Alphabetical order.
  - **Joined:** Most recently joined users first.

**Note:** "Featured" users are pinned to the top of the list regardless of the sorting order.

### 4. User Profiles

Each user in the list is displayed as a card containing specific details.

#### Profile Elements

- **Avatar:** The user's profile picture (or their initial if none is set).
  - **Gold/Special Border:** Indicates a ranked or highly active user.
  - **Green Ring:** Indicates a verified account.
- **Name & Date:** Displays their display name and the date they joined the community.
- **Badges:**
  - **Verified Badge:** A checkmark indicating the user has verified their Zcash address or social links.
  - **Rank Badge:** Displays "All-time" ranking stats if applicable.
- **Interaction:** Clicking a user card opens their full Zcash.me profile in a new tab.

### 5. Top Cities Leaderboard

The **Header Bar** features a live **Leaderboard**.

- This displays the top 3 cities globally ranked by user count (e.g., "#1 New York").
- Clicking any city in the leaderboard instantly navigates the map to that location.

### 6. Sharing Locations (Deep Linking)

The map supports "Deep Linking." As you navigate, the URL in your browser address bar updates automatically.

- **Example:** `maps.zcash.me/usa/new-york`
- You can copy and share this URL. When someone else clicks it, the map will load directly with that country and city selected and the panel open.

## FAQ

### **Q: Why is a Cloudflare Worker used if the site is static?**

**A:** Even though the frontend is static, it cannot efficiently run backend logic or parse large datasets without slowing down the user experience. The Worker provides a lightweight API layer to load data, proxy queries, and keep logic/keys off the client-side.

### **Q: Does this website track my personal location?**

**A:** No. The website uses a "Privacy First" approach. It visualizes aggregated  users associated with a city and does not perform real-time GPS tracking of site visitors.

### **Q: How is the data stored?**
