class Nori

	constructor: ->
		@beans = []

	# Add many beans at once
	addBeans: (beans) ->
		@addBean bean for bean in beans

	# Add single bean
	addBean: (bean) ->

		# Remove old bean, when duplicate
		oldBean = @beanByName(bean.name)

		if oldBean
			oldBeanIndex = @beans.indexOf oldBean
			@beans.splice oldBeanIndex, 1

		# Store new bean
		@beans.push bean

	# Find bean by name
	beanByName: (beanName) ->
		foundBean = null
		
		for bean in @beans
			do ->
				foundBean = bean if bean.name == beanName

		foundBean

# Make it global
window.Nori = Nori