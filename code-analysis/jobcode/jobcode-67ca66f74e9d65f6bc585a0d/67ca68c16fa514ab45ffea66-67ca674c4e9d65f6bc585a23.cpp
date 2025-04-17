#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

pair<int, int> twoSum(const vector<int>& nums, int target) {
    for (size_t i = 0; i < nums.size(); ++i) {
        for (size_t j = i + 1; j < nums.size(); ++j) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
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
    
    pair<int, int> result = twoSum(nums, target);
    
    if (result.first != -1) {
        cout << min(result.first, result.second) << " " << max(result.first, result.second) << endl;
    } else {
        cout << "No solution found" << endl;
    }
    
    return 0;
}