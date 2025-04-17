#include <iostream>
#include <vector>
#include <unordered_set>
#include <sstream>
using namespace std;

vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_set<int> seen;
    for (size_t i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (seen.count(diff)) {
            for (size_t j = 0; j < i; ++j) {
                if (nums[j] == diff) {
                    return {static_cast<int>(j), static_cast<int>(i)};
                }
            }
        }
        seen.insert(nums[i]);
    }
    return {-1, -1};
}

int main() {
    string input;
    getline(cin, input);
    stringstream ss(input);
    
    vector<int> nums;
    int num;
    while (ss >> num) {
        nums.push_back(num);
    }
    
    int target = nums.back();
    nums.pop_back();
    
    vector<int> result = twoSum(nums, target);
    
    if (result[0] != -1) {
        cout << min(result[0], result[1]) << " " << max(result[0], result[1]) << endl;
    } else {
        cout << "No solution found" << endl;
    }
    
    return 0;
}
