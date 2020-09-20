module.exports = {
    'env': {
        'node': true,
        'commonjs': true,
        'es2020': true,
        'jest': true
    },
    'extends': 'eslint:recommended', // 我们的默认配置从 eslint:recommended来的:
    'parserOptions': {
        'ecmaVersion': 11
    },
    'rules': {
        'indent': [
            'error',
            2
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'eqeqeq': 'error', // 如果除了三个等于运算符之外，相等是被检查的。
        'no-trailing-spaces': 'error', // 在大括号之前和之后总有一个空格
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [ // 箭头函数的函数参数中一致使用空格
            'error', {'before': true, 'after': true}
        ],
        'no-console': 0 //  禁用规则可以通过在配置文件中将其“ value”定义为0来实现。 在此期间让我们这样做把no-console检查关掉 。
    }
}
