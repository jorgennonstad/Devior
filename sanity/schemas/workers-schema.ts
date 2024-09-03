import { Rule } from 'sanity';

const about = {
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title for the About section',
      validation: (Rule: Rule) => Rule.required().max(100).warning('Should be under 100 characters'),
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'A short bio about you and your business owner',
      validation: (Rule: Rule) => Rule.required().max(500).warning('Should be under 500 characters'),
    },
    {
      name: 'imageOne',
      title: 'Image One',
      type: 'image',
      description: 'First image representing you or your business',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for the first image',
          validation: (Rule: Rule) => Rule.required().max(100).warning('Should be under 100 characters'),
        },
        {
          name: 'name',
          title: 'Name',
          type: 'string',
          description: 'Name of the person in the first image',
          validation: (Rule: Rule) => Rule.required().max(50).warning('Should be under 50 characters'),
        },
        {
          name: 'age',
          title: 'Age',
          type: 'number',
          description: 'Age of the person in the first image',
          validation: (Rule: Rule) => Rule.required().min(0).max(120).warning('Age should be between 0 and 120'),
        },
      ],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'imageTwo',
      title: 'Image Two',
      type: 'image',
      description: 'Second image representing you or your business',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for the second image',
          validation: (Rule: Rule) => Rule.required().max(100).warning('Should be under 100 characters'),
        },
        {
          name: 'name',
          title: 'Name',
          type: 'string',
          description: 'Name of the person in the second image',
          validation: (Rule: Rule) => Rule.required().max(50).warning('Should be under 50 characters'),
        },
        {
          name: 'age',
          title: 'Age',
          type: 'number',
          description: 'Age of the person in the second image',
          validation: (Rule: Rule) => Rule.required().min(0).max(120).warning('Age should be between 0 and 120'),
        },
      ],
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
};

export default about;
