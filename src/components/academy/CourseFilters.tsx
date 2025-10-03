
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CourseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedSort,
  onSortChange,
  viewMode,
  onViewModeChange,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Courses', count: 24 },
    { id: 'basics', label: 'Trading Basics', count: 8 },
    { id: 'technical', label: 'Technical Analysis', count: 6 },
    { id: 'fundamental', label: 'Fundamental Analysis', count: 4 },
    { id: 'psychology', label: 'Trading Psychology', count: 3 },
    { id: 'advanced', label: 'Advanced Strategies', count: 3 },
  ];

  const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration', label: 'Duration' },
  ];

  return (
    <div className="space-y-6">
      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 border-2 focus:border-primary/50"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className="w-48 h-12">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <Tabs value={viewMode} onValueChange={onViewModeChange} className="h-12">
            <TabsList className="h-full">
              <TabsTrigger value="grid" className="px-4">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-4">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="h-12 px-4"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto scrollbar-hide">
        <motion.div className="flex gap-2 min-w-max pb-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-card hover:bg-primary/10 text-muted-foreground hover:text-foreground border border-border/50'
              }`}
            >
              <span>{category.label}</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty.toLowerCase().replace(' ', '-')}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="0-999">₹0 - ₹999</SelectItem>
                      <SelectItem value="1000-2999">₹1000 - ₹2999</SelectItem>
                      <SelectItem value="3000+">₹3000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 hours</SelectItem>
                      <SelectItem value="2-5">2-5 hours</SelectItem>
                      <SelectItem value="5-10">5-10 hours</SelectItem>
                      <SelectItem value="10+">10+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseFilters;
