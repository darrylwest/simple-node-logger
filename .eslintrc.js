module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "describe": true,
        "it": true,
        "before": true
    },
    "rules": {
        "eqeqeq": "error",
        "curly": "error",
        "complexity": [ "error", 10 ],
        "brace-style": [ "error", "1tbs" ],
        "indent": [ "error", 4 ],
        "linebreak-style": [ "error", "unix" ],
        "no-param-reassign": [ "error", { props: false } ],
        "quotes": [ "error", "single" ],
        "semi": [ "error", "always" ]
    }
};
