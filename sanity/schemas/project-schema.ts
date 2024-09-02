import { Rule } from 'sanity';

const project = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Project Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'bio',
      title: 'Project Bio',
      type: 'text',
      description: 'A short description of the project',
      validation: (Rule: Rule) => Rule.max(200).warning('Should be under 200 characters'),
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      description: 'Image displayed by default',
      options: {
        hotspot: true, // Enables selecting a focus point
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'hoverImage',
      title: 'Hover Image',
      type: 'image',
      description: 'Image displayed when hovered over',
      options: {
        hotspot: true,
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'Project URL',
      type: 'url',
      description: 'Link to the project website',
      validation: (Rule: Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    },
  ],
};

export default project;
