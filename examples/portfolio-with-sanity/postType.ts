import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    // defineField({
    //   name: 'content',
    //   type: 'array',
    //   of: [{type: 'block'}],
    // }),
    defineField({
      name: 'client',
      type: 'string',
    }),
    defineField({
      name: 'role',
      type: 'string',
    }),
    defineField({
      name: 'technologies',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'height',
      type: 'string',
      options: {
        list: ['sm', 'md', 'lg'],
      },
    }),
  ],
})
