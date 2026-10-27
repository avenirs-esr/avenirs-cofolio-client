import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
}, {
  rules: {
    'style/space-before-function-paren': ['error', 'always'],
    'style/comma-dangle': 'off',
  },
})
