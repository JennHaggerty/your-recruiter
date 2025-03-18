import Job from '@/app/interfaces/Job';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
export const automatedCoverLetter = async(args: { job: Job, openAiKey: string }) => {
  const { job, openAiKey } = args;
  const myApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!job._markdown || (!myApiKey && !openAiKey)) return;
  const openai = createOpenAI({
     apiKey: openAiKey || myApiKey
  });
  
  try {
    const posting = job._markdown;
    const resume = job.resume;
    const requirements = job.cover_letter_requirements;
    const coverLetterWording = requirements 
      ? ` can you write me a cover letter with these requirements ${requirements}`
      : ` can you write me a cover letter that is three paragraphs long and less than 400 words`;
    const resumeWording = resume 
      ? ` and my resume ${resume}` 
      : ``;
    const options = `
      I want the tone to be conversational as if I'm talking to someone about how I can work within their ecosystem. 
      I do not want any buzzwords, and do not add how excited about the opportunity I am`;
    const prompt = `Based on this job description ${posting} ${resumeWording} ${coverLetterWording} ${options} with this date ` + new Date();
    const { text } = await generateText({  
      model: openai('o1-mini'),
      prompt
    });
  
    return text;
  } catch (e) {
    console.log('Error writing cover letter, ', e);
  }
}