import { useState } from 'react';
import SearchUsers from './SearchUsers';
import SearchPosts from './SearchPosts';
import SearchComments from './SearchComments';

const searchTabs = [
  { title: 'Users', component: <SearchUsers /> },
  { title: 'Posts', component: <SearchPosts /> },
  { title: 'Comments', component: <SearchComments /> },
];

const SearchResults = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-wrap border-b border-text-secondary-dark flex-1 items-center justify-around text-lg text-text-primary-dark">
        {searchTabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`py-4 hover:bg-background-overlay-dark w-auto flex-1 px-2 text-center duration-300 `}
          >
            <div
              className={` w-full ${
                activeTab === i
                  ? 'text-text-primary-dark font-bold'
                  : 'text-text-secondary-dark'
              }`}
            >
              {tab.title}
            </div>
          </button>
        ))}
      </div>
      <div>{searchTabs[activeTab].component}</div>
    </div>
  );
};

export default SearchResults;
