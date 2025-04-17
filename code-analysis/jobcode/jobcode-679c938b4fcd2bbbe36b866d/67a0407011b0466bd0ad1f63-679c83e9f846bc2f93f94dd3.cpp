#include <iostream>
#include <vector>
#include <unordered_map>
#include <sstream>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (map.find(diff) != map.end()) {
            return {map[diff], i};
        }
        map[nums[i]] = i;
    }
    return {};
}

int main() {
    string input;
    getline(cin, input); // Read input as a single line
    stringstream ss(input);
    
    vector<int> nums;
    int num;
    while (ss >> num) {
        nums.push_back(num);
    }
    
    int target = nums[nums.size() - 1]; // Last number is the target
    nums.pop_back(); // Remove target from the vector
    
    vector<int> result = twoSum(nums, target);
    
    if (!result.empty()) {
        cout << min(result[0], result[1]) << " " << max(result[0], result[1]) << endl;
    } else {
        cout << "No solution found" << endl;
    }
    
    return 0;
}
